export type KeyValueConfiguration = {
  key: {
    value: string;
  };

  value: {
    value: string;
  };
};

export type FormKeyValueConfigurationsProps = {
  item: {
    id: string;
    name: string;
    children: {
      results: Array<KeyValueConfiguration>;
    };
  };
};
