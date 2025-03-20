import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';

const Notification = () => {
  const toast = useToast();

  useEffect(() => {
    window.electron.ipcRenderer.on('notification', (args) => {
      const title: string = args[0];
      const description: string = args[1];
      const status: 'success' | 'error' = args[2];

      toast({
        title,
        description,
        status,
        duration: 9000,
        isClosable: true,
        position: 'bottom-left',
      });
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('notification');
    };
  }, []);

  return <div />;
};

export default Notification;
