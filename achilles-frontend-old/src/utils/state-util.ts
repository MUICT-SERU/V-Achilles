const StateUtil = {
  setRequest: (name: string, state: any) => {
    return {
      ...state,
      [`isLoading${name}`]: true,
      [`isError${name}`]: false,
    };
  },

  setSuccess: (name: string, state: any) => {
    return {
      ...state,
      [`isLoading${name}`]: false,
      [`isError${name}`]: false,
    };
  },

  setFailure: (name: string, state: any) => {
    return {
      ...state,
      [`isLoading${name}`]: false,
      [`isError${name}`]: true,
    };
  },
};

export { StateUtil };
