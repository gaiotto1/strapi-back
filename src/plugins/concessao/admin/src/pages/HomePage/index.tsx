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
  tipos_de_acesso: {
    id: string;
  }
}

type optionsState = {
  value: string;
  label: string;
  tipos_de_acesso: {
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

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const token = sessionStorage.getItem('jwtToken');
  const tokenFormatado = token?.replace(/['"]+/g, '');

  const handleChange = (e) => {
    console.log(e);
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

  const handleRemove = (id, action) => {
    setEnableAlert(false);

    const newUsuarios = usuarios.filter(usuario => usuario.id !== id);
    setUsuarios(newUsuarios);

    if (action === 'remove') {
      setMessageAlert({
        message: 'Usuário reprovado',
        type: 'success',
      });
    } else {
      setMessageAlert(
        {
          message: 'Usuário aprovado',
          type: 'success',
        }
      );
    }

    setEnableAlert(true);

    const timer = setTimeout(() => {
      setEnableAlert(false);
      clearTimeout(timer);
    }, 3000);
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
                      onChange={(e) => handleChange(e)}
                      valueSelected={usuario?.tipos_de_acesso?.id}
                    />
                  </div>
                </div>

                <div className="containerThree">
                  <Button
                    variant="success-light"
                    onClick={() => handleRemove(usuario?.id, 'add')}
                  >
                    <Icon color="secondary500" as={Check} />
                  </Button>

                  <Button
                    variant='danger-light'
                    onClick={() => handleRemove(usuario?.id, 'remove')}
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
