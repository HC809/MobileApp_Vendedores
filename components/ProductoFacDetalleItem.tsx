import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItemProps, Text, Layout } from '@ui-kitten/components';

//Helpers
import { formatNumber } from '../helpers/functions/functions';

export type CartItemProps = ListItemProps & {
  product: IProductoFactura;
};

export const ProductoFacDetalleItem = React.memo((props: CartItemProps): React.ReactElement => {

  const { product } = props;

  return (
    <Layout level='2' style={styles.detailsContainer}>
      <Text
        category='s1'>
        {product.producto}
      </Text>
      <Text
        appearance='hint'
        category='p2'>
        Código : {product.codigoproducto}
      </Text>

      <View style={styles.row}>
        <View style={styles.col1} >
          <View style={styles.row}>
            <View style={styles.col1} >
              <Text category='p2'>Subtotal</Text>
              <Text category='p2'>Total Descuento</Text>
              <Text category='p2'>Total Impuesto</Text>
              <Text category='s1' status='success'>Total</Text>
            </View>
            <View style={styles.col2} >
              <Text category='p2' style={styles.textRight}>{formatNumber(product.subtotal)}</Text>
              <Text category='p2' style={styles.textRight}>{formatNumber(product.totalDescuento)}</Text>
              <Text category='p2' style={styles.textRight}>{formatNumber(product.totalImpuesto)}</Text>
              <Text category='s1' style={styles.textRight} status='success'>{formatNumber(product.total)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.col2} >
          <Text appearance="hint" style={{ alignContent: 'stretch', textAlign: 'center' }}>Cantidad</Text>
          <Text
              style={{ alignContent: 'stretch', textAlign: 'center' }}
              category='h6'>
              {`${product.cantidad}`}
            </Text>
        </View>
      </View>
    </Layout>
  );
})

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  detailsContainer: {
    flex: 1,
    height: '100%',
    padding: 16,
  },
  row: { flex: 1, alignSelf: 'stretch', flexDirection: 'row', padding: 4 },
  col1: { flex: 0.85, alignSelf: 'stretch' },
  col2: { flex: 0.6, alignSelf: 'stretch' },
  textRight: { textAlign: "right" }
});
