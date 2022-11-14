/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import pluginId from '../../pluginId';
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
}

const HomePage: React.VoidFunctionComponent = () => {
  const history = useHistory();
  const [usuarios, setUsuarios] = useState<usuariosState[]>([]);
  const [messageAlert, setMessageAlert] = useState('teste de mensagem');
  const [enableAlert, setEnableAlert] = useState(false);


  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  console.info('userInfo', userInfo);

  const options = [
    { value: 'agencia', label: 'Agência' },
    { value: 'compras', label: 'Compras' },
    { value: 'fornecedor', label: 'Fornecedor' },
    { value: 'franquia', label: 'Franquia' },
    { value: 'internocorporativo', label: 'Interno corporativo' },
    { value: 'revenda', label: 'Revenda' },
    { value: 'tradecorporativo', label: 'Trade corporativo' },
  ];


  const handleChange = (e) => {
    console.log(e);
  };

  const getUsers = async () => {
    /*
    const token = sessionStorage.getItem('jwtToken');

    const response = await fetch('http://localhost:8000/users', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }); */

    const users = [
      { id: 1, nome: 'Joselito da Silva', email: 'joselitodasilva@outlook.com'},
      { id: 2, nome: 'João', email: 'joao@gmail.com.br'},
      { id: 3, nome: 'Maria 2', email: 'maria@gmail.com.br'},
      { id: 4, nome: 'Marta 3', email: 'marta@gmail.com.br'},
      { id: 5, nome: 'Marta 4', email: 'marta@gmail.com.br'},
      { id: 6, nome: 'Marta 5', email: 'marta@gmail.com.br'},
      { id: 7, nome: 'Marta 6', email: 'marta@gmail.com.br'},
      { id: 8, nome: 'Marta 7', email: 'marta@gmail.com.br'},
      { id: 9, nome: 'Marta 8', email: 'marta@gmail.com.br'},
      { id: 10, nome: 'Marta 9', email: 'marta@gmail.com.br'},
      { id: 11, nome: 'Marta 10', email: 'marta@gmail.com.br'},
      { id: 12, nome: 'Marta 11', email: 'marta@gmail.com.br'},
      { id: 13, nome: 'Marta 12', email: 'marta@gmail.com.br'},
      { id: 14, nome: 'Marta 13', email: 'marta@gmail.com.br'},
      { id: 15, nome: 'Marta 14', email: 'marta@gmail.com.br'},
      { id: 16, nome: 'Marta 15', email: 'marta@gmail.com.br'}
    ]

    setUsuarios(users);
  };

  const handleRemove = (id, action) => {
    setEnableAlert(false);

    const newUsuarios = usuarios.filter(usuario => usuario.id !== id);
    setUsuarios(newUsuarios);

    if (action === 'remove') {
      setMessageAlert('Usuário reprovado');
    } else {
      setMessageAlert('Usuário aprovado');
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
    getUsers();
  }, []);



  return (
    <div className="containerHome">

      {enableAlert && (
        <div className="containerAlert">
          <Alert
            closeLabel="Close alert"
            title="Sucesso:"
            variant="success"
            className="alert"
            onClose={() => setEnableAlert(false)}>
            {messageAlert}
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
                    <SelectPermissoes options={options} onChange={(e) => handleChange(e)} />
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
