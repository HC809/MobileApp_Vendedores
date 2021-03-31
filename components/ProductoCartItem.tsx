import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ListItem, ListItemProps, Text } from '@ui-kitten/components';
import { CloseIcon, MinusIcon, PlusIcon } from '../assets/Icons/CartItemIcons';
//Helpers
import { formatNumber } from '../helpers/functions/functions';
import { incrementarCantidadProducto, decrementarCantidadProducto } from '../helpers/functions/pedido';

export type CartItemProps = ListItemProps & {
  index: number;
  product: IProductoFactura;
  onProductChange: (product: IProductoFactura, index: number) => void;
  onRemove: (index: number) => void;
  finalizado: boolean;
};

export const ProductoCartItem = React.memo((props: CartItemProps): React.ReactElement => {

  const { style, product, index, onRemove, onProductChange, finalizado, ...listItemProps } = props;

  //Quitar producto del pedido 
  const onRemoveButtonPress = (): void => {
    onRemove(index);
  };

  //Decrementar cantidad
  const handleDecrementarCantidad = (): void => {
    let productoActualizado = decrementarCantidadProducto(product, 1);
    onProductChange(productoActualizado, index);
  };

  //Incrementar cantidad
  const handleIncrementarCantidad = (): void => {
    let productoActualizado = incrementarCantidadProducto(product, 1);
    onProductChange(productoActualizado, index);
  };

  //Condicion para habilitar boton 'Decrementar Cantidad'
  const decrementButtonEnabled = (): boolean => {
    return product.cantidad > 1;
  };

  //Condicion para habilitar boton 'Incrementar Cantidad'
  const incrementButtonEnabled = (): boolean => {
    return (product.cantidad >= product.cantidadstock);
  };

  return (
    <ListItem
      {...listItemProps}
      style={[styles.container, style]}>
      <View style={styles.detailsContainer}>
        <Text
          category='h6'>
          {product.producto}
        </Text>
        <Text
          appearance='hint'
          category='p1'>
          Precio: {`L ${formatNumber(product.precio)}`}
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
            <View style={styles.amountContainer}>
              <Button
                style={[styles.iconButton, styles.amountButton]}
                size='small'
                icon={MinusIcon}
                onPress={handleDecrementarCantidad}
                disabled={!decrementButtonEnabled() || finalizado}
              />
              <Text
                style={styles.amount}
                category='h6'>
                {`${product.cantidad}`}
              </Text>
              <Button
                style={[styles.iconButton, styles.amountButton]}
                size='small'
                icon={PlusIcon}
                onPress={handleIncrementarCantidad}
                disabled={incrementButtonEnabled() || finalizado}
              />
            </View>
          </View>

        </View>
      </View>
      <Button
        style={[styles.iconButton, styles.removeButton]}
        appearance='ghost'
        status='basic'
        icon={CloseIcon}
        onPress={onRemoveButtonPress}
        disabled={finalizado}
      />
    </ListItem>
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
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  amountButton: {
    borderRadius: 20,
  },
  amount: {
    textAlign: 'center',
    width: 40,
  },
  removeButton: {
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  row: { flex: 1, alignSelf: 'stretch', flexDirection: 'row', padding: 4 },
  col1: { flex: 0.85, alignSelf: 'stretch' },
  col2: { flex: 0.6, alignSelf: 'stretch' },
  textRight: { textAlign: "right" },
});
