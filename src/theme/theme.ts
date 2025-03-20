import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: { defaultProps: { size: 'sm' } },
    IconButton: { defaultProps: { size: 'sm' } },
    Input: { defaultProps: { size: 'sm' } },
    NumberInput: { defaultProps: { size: 'sm' } },
    Table: { defaultProps: { size: 'sm' } },
    Modal: {
      defaultProps: {
        isCentered: true,
      },
    },
  },
});

export default theme;
