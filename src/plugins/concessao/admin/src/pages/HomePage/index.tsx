import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { Stack, Typography, Button, Icon, Alert } from '@strapi/design-system'
import { Check, Cross } from '@strapi/icons';

import SelectPermissoes from '../../components/SelectPermissoes';
import EmptyUsers from '../../components/EmptyUsers';

import './styles.css';

type usuariosState = {
  id: number;
  nome: string;
  email: string;
  tipo_de_acesso: {
    id: string;
  }
}

type optionsState = {
  value: string;
  label: string;
  tipo_de_acesso: {
    id: string;
  }
}

const HomePage: React.VoidFunctionComponent = () => {
  const history = useHistory();
  const [usuarios, setUsuarios] = useState<usuariosState[]>([]);
  const [messageAlert, setMessageAlert] = useState({
    message: '',
    type: 'success',
  });
  const [enableAlert, setEnableAlert] = useState(false);
  const [options, setOptions] = useState<optionsState[]>([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = localStorage.getItem('jwtToken');
  const tokenFormatado = token?.replace(/['"]+/g, '');

  const handleChange = (idTypeAccess, idUser) => {
    console.info('idTypeAccess', idTypeAccess);
    const newUsuarios = usuarios.map((usuario) => {
      if (usuario.id === idUser) {
        return {
          ...usuario,
          tipo_de_acesso: {
            ...usuario.tipo_de_acesso,
            id: idTypeAccess,
          }
        };
      }
      return usuario;
    });

    setUsuarios(newUsuarios);
  };

  const getTiposAcesso = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:1337/solicitacoes-de-acesso/tiposDeAcesso',
        {
          headers: {
            'Authorization': `Bearer ${tokenFormatado}`
          }
        }
        );

      const options = data.results.map((item) => {
        return {
          value: item.id,
          label: item.nome,
        };
      });

      setOptions(options);
    } catch {
      setOptions([]);
    }
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:1337/solicitacoes-de-acesso/usuariosAguardandoAprovacao',
        {
          headers: {
            'Authorization': `Bearer ${tokenFormatado}`
          }
        }
      );

      setUsuarios(data);
    } catch {
      setUsuarios([]);
    }
  };

  const handleApprove = async (id: number, typeAccess: string) => {
    try {
      const { data } = await axios.post(
        'http://localhost:1337/solicitacoes-de-acesso/aprovar',
        {
          usuario_id: id,
          tipo_de_acesso_id: typeAccess,
        },
        {
          headers: {
            'Authorization': `Bearer ${tokenFormatado}`
          }
        }
      );

      setMessageAlert({
        message: 'Usuário aprovado',
        type: 'success',
      });
      setEnableAlert(true);

      setUsuarios(data);
    } catch {
      setMessageAlert({
        message: 'Falha ao aprovar usuário',
        type: 'error',
      });
      setEnableAlert(true);
    }
  };

  const handleReprove = async (id: number, typeAccess: string) => {
    try {
      const { data } = await axios.post(
        'http://localhost:1337/solicitacoes-de-acesso/reprovar',
        {
          usuario_id: id,
          tipo_de_acesso_id: typeAccess,
        },
        {
          headers: {
            'Authorization': `Bearer ${tokenFormatado}`
          }
        }
      );

      setMessageAlert({
        message: 'Usuário reprovado',
        type: 'success',
      });
      setEnableAlert(true);

      setUsuarios(data);
    } catch {
      setMessageAlert({
        message: 'Falha ao reprovar usuário',
        type: 'error',
      });
      setEnableAlert(true);
    }
  };

  const handleNavigateUser = (id) => {
    history.push(`/content-manager/collectionType/plugin::users-permissions.user/${id}`);
  };

  useEffect(() => {
    getTiposAcesso();
    getUsers();
  }, []);

  return (
    <div className="containerHome">

      {enableAlert && (
        <div className="containerAlert">
          <Alert
            closeLabel="Close alert"
            title="Sucesso:"
            variant={messageAlert.type}
            className="alert"
            onClose={() => setEnableAlert(false)}>
            {messageAlert.message}
          </Alert>
        </div>
      )}

      <Stack spacing={4} padding={100}>
        <Typography as="h1" variant="alpha">
          Olá, {userInfo?.firstname} 👋
        </Typography>

        <Typography variant="epsilon" className="subtitle">
          Esse é o backoffice do Portal do Trade: todas as ferramentas necessárias para que o produto continue rodando.
        </Typography>

        <div className="containerTable">
          <Typography variant="epsilon" fontWeight="semiBold" textColor="neutral800">
            Novas solicitações
          </Typography>

          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="rowTable">
                <div className="containerOne">
                  <div>
                    <Typography as="a" variant="omega" textColor="primary600" onClick={() => handleNavigateUser(usuario.id)}>
                      {usuario?.nome}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="omega" textColor="neutral600">{usuario?.email}</Typography>
                  </div>
                </div>

                <div className="ContainerTwo">
                  <div className="containerTwoIntern">
                    <SelectPermissoes
                      options={options}
                      onChange={(e) => handleChange(e.target.value, usuario.id)}
                      valueSelected={usuario?.tipo_de_acesso?.id}
                    />
                  </div>
                </div>

                <div className="containerThree">
                  <Button
                    variant="success-light"
                    onClick={() => handleApprove(usuario?.id, usuario?.tipo_de_acesso?.id)}
                  >
                    <Icon color="secondary500" as={Check} />
                  </Button>

                  <Button
                    variant='danger-light'
                    onClick={() => handleReprove(usuario?.id, usuario?.tipo_de_acesso?.id)}
                  >
                    <Icon color="secondary500" as={Cross} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyUsers />
            )}
        </div>
      </Stack>
    </div>
  );
};

export default HomePage;
