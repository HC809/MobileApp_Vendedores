import React, { useState } from "react";
import { StyleSheet, View, Dimensions, FlatList } from "react-native";
import {
  Divider,
  TopNavigation,
  Icon,
  Text,
  Input,
  Card,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch, connect } from "react-redux";
//Components
import { DrawerAction } from "../components/Common/DrawerAction";
//Models
import { ICliente } from "../models/Cliente/ICliente";
import { ISelectOption } from "../models/common";
import { IFacSaldoPendiente } from "../models/Factura/IFacSaldoPendiente";
//Actions
import { setVariables } from "../store/actions/general";
//Helpers
import { formatNumber } from "../helpers/functions/functions";

const window = Dimensions.get("window");

const Clientes = ({ navigation }) => {
  const dispatch = useDispatch();

  //const dataDias: ISelectOption[] = useSelector(state => [{ id: 99, text: 'Todos' }, ...state.variables.dias]);
  const clientes: ICliente[] = useSelector((state) => state.bd.cliente.items);
  const cobranza: IFacSaldoPendiente[] = useSelector(
    (state) => state.cobranza.cobranza
  );

  //const [selectedOption, setselectedOption] = React.useState<ISelectOption>(dataDias.find(x => x.id === 99));

  const [listaClientes, setlistaClientes] = useState(clientes);
  const [searchText, setsearchText] = useState("");

  // useEffect(() => {
  //     (selectedOption.id !== 99)
  //         ? setlistaClientes(clientes.filter(x => x.iddias.includes(Number(selectedOption.id))))
  //         : setlistaClientes(clientes);
  // }, []);

  const SearchIcon = (style) => <Icon {...style} name="search" />;

  const searchFilterFunction = (text) => {
    setsearchText(text);

    let newData = clientes.filter((item) => {
      let itemData = `${item.codigocliente.toUpperCase()}${item.nombrecliente.toUpperCase()}`;
      let textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setlistaClientes(newData);
  };

  // const handlesetSelectedOption = (op: ISelectOption) => {
  //     setselectedOption(op);
  //     setlistaClientes((op.id === 99) ? clientes : clientes.filter(x => x.iddias.includes(Number(op.id))))
  // }

  const SearchBar = () => (
    <View>
      {/* <Select
                style={styles.barraItem}
                size='medium'
                data={dataDias}
                selectedOption={selectedOption}
                onSelect={(op: ISelectOption) => handlesetSelectedOption(op)}
            /> */}
      <Input
        size="medium"
        style={[styles.barraItem]}
        placeholder="Buscar..."
        icon={SearchIcon}
        onChangeText={(text) => searchFilterFunction(text)}
        value={searchText}
      />
    </View>
  );

  const saldoPendienteCliente = (idCliente: number): string => {
    let saldoPendiente = 0;
    let facClienteSaldoPendiente = cobranza.filter(
      (c) => c.idcliente === idCliente
    );
    if (facClienteSaldoPendiente.length > 0) {
      facClienteSaldoPendiente.map((f) => {
        saldoPendiente = saldoPendiente + f.valorsaldofactura;
      });
    }

    return saldoPendiente > 0 ? `L. ${formatNumber(saldoPendiente)}` : "";
  };

  const renderItem = ({ item }: { item: ICliente; index: number }) => {
    return (
      <Card
        style={styles.item}
        status="basic"
        onPress={() => {
          dispatch(setVariables({ cliente: item }));
          navigation.navigate("c_Gestiones");
        }}
      >
        <Text category="s2">{`${item.nombrecliente}`}</Text>
        <Divider />
        <View style={styles.footerContainer}>
          <Text appearance="hint" category="c1">
            {`Código : ${item.codigocliente}`}
          </Text>
          <Text
            category="s2"
            appearance="hint"
            status="danger"
            style={{ fontStyle: "italic" }}
          >
            {`${saldoPendienteCliente(item.idcliente)}`}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Clientes"
        alignment="center"
        subtitle="Lista de Clientes"
        leftControl={<DrawerAction navigation={navigation} />}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      {SearchBar()}
      <FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={listaClientes}
        renderItem={renderItem}
        keyExtractor={(index) => index.idcliente.toString()}
        initialNumToRender={8}
        keyboardShouldPersistTaps={"handled"}
        ListEmptyComponent={() => (
          <View style={styles.content}>
            <View>
              <Text
                category="s1"
                appearance="hint"
                style={{ textAlign: "center" }}
              >
                No tiene clientes asignados a su ruta.
              </Text>
            </View>
            {/* <Text category='s1'>
                            {(selectedOption.id === 99)
                                ? 'No tiene clientes asignados a su ruta.'
                                : 'No tiene clientes asignados para este día.'}
                        </Text> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVariables: (payload: any) => {
      return dispatch(setVariables(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(Clientes);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
  bar: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  barraItem: {
    width: window.width - 20,
    maxWidth: window.width - 20,
    margin: 5,
    marginLeft: 10,
  },
  barraItem2: {
    width: window.width / 2 + 80 - 10,
    maxWidth: window.width / 2 + 80 - 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
