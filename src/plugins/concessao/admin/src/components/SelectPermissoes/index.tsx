
import React, { useEffect, useState} from 'react';
import { Select, Option } from '@strapi/design-system/Select';

const SelectPermissoes = ({ options, onChange, valueSelected = '' }) => {
  const [values, setValues] = useState('');

  useEffect(() => {
    if (valueSelected !== '') {
      setValues(valueSelected);
    }
  }, [valueSelected]);

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
