import React from 'react'
import { Layout, Text, Modal } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { usePromiseTracker } from "react-promise-tracker";
import { UIActivityIndicator } from 'react-native-indicators';

const spinners = () => (
  <Layout style={styles.containerS} level='1'>
    <UIActivityIndicator color='#21B000' size={50} />
  </Layout>
);

export const LoadingIndicator = React.memo((props: any) => {
  const { promiseInProgress } = usePromiseTracker({ area: props.area });

  return (
    <View>
      {
        (promiseInProgress === true)
          ? <Modal
            backdropStyle={styles.backdrop}
            onBackdropPress={() => { }}
            visible={true} >
            <Layout
              level='1'
              style={styles.modalContainer}>
              <Text>Cargando...</Text>
              {spinners()}
            </Layout>
          </Modal >
          : <></>
      }
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 256,
    padding: 16,
    borderRadius: 5
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  containerS: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }
});
