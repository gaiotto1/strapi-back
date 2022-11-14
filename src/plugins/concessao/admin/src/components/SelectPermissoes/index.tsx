/*
import { Select, Option } from '@strapi/design-system/Select';

<Select
                  id="select1"
                  label=""
                  placeholder="Selecione"
                  hint=""
                  clearLabel=""
                  error={undefined}
                  size="M"
                  value={values}
                  onChange={setValues} disabled={false}
                >
                  <Option value={'agencia'}>Agência</Option>
                  <Option value={'compras'}>Compras</Option>
                  <Option value={'fornecedor'}>Fornecedor</Option>
                  <Option value={'franquia'}>Franquia</Option>
                  <Option value={'internocorporativo'}>Interno corporativo</Option>
                  <Option value={'revenda'}>Revenda</Option>
                  <Option value={'tradecorporativo'}>Trade corporativo</Option>
                </Select>*/

import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';

const SelectPermissoes = ({ options, onChange }) => {
  const [values, setValues] = React.useState('');

  return (
    <Select
      id="select1"
      label=""
      placeholder="Selecione"
      hint=""
      clearLabel=""
      error={undefined}
      size="M"
      value={values}
      onChange={(e) => {
        setValues(e);
        onChange(e);
      }}
      disabled={false}
    >
      {options.map((option) => (
        <Option value={option.value}>{option.label}</Option>
      ))}
    </Select>
  );
};

export default SelectPermissoes;
