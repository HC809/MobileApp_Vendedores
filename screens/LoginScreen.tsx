import React, { useState, useRef, useEffect } from "react";
import { Button as RNButton, StyleSheet, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from "react-redux";
import { Button, Input, Layout, Modal, Text } from "@ui-kitten/components";
import * as Yup from "yup";
import { Formik } from "formik";
import { trackPromise } from "react-promise-tracker";
//Models
import { IUsuarioLogin } from "../models/Usuario/IUsuarioLogin";
import { IUsuario } from "../models/Usuario/IUsuario";
//API
import api from "../api/comercialLaRocaApi";
//Actions
import userInit from "../store/actions/userLogin";
//Components
import { EyeIcon, EyeOffIcon, PersonIcon } from "../assets/Icons/LoginIcons";
import { LoadingIndicator } from "../components/Common/LoadingIndicator";
import Background from "../components/Common/Background";
import Logo from "../components/Common/Logo";
import { WarningModal } from "../components/Common/WarningModal";

const window = Dimensions.get("window");

const loginSchema = Yup.object().shape({
  UserName: Yup.string().required("Ingrese su usuario"),
  Password: Yup.string().required("Ingrese su contraseña"),
});

const LoginScreen = () => {
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [
    visibleModalErrorConexion,
    setVisibleModalErrorConexion,
  ] = useState<boolean>(false);
  const [
    visibleModalRegistroCaiRecibo,
    setVisibleModalRegistroCaiRecibo,
  ] = useState<boolean>(false);

  const [user, setUser] = useState<IUsuario>(null);
  const [token, setToken] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const ModalErrorConexion = () => {
    return (
      <WarningModal
        title="Error de Conexión"
        text="Verifique que tenga conexión a internet e intente de nuevo."
        visibleModal={visibleModalErrorConexion}
        setVisibleModal={setVisibleModalErrorConexion}
      />
    );
  };

  const ModalRegistroCaiRecibos = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setVisibleModalRegistroCaiRecibo(false);
        }}
        visible={visibleModalRegistroCaiRecibo}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Numerador Recibos</Text>
          <View
            style={{
              borderColor: "#F40707",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            El punto de emisión no tiene configurado un numerador para recibos.
            Por la tanto no podrá cobrar. ¿Desea continuar?
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setVisibleModalRegistroCaiRecibo(false);
              }}
              size="small"
              appearance="outline"
            >
              Cancelar
            </Button>

            <Button
              status="danger"
              onPress={() => {
                AsyncStorage.setItem("token", token);
                dispatch(userInit(user));
              }}
              style={styles.button}
              size="small"
            >
              Continuar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const onSignInButtonPress = async (user: IUsuarioLogin): Promise<void> => {
    await trackPromise(
      api.Usuario.login(user.UserName.trim(), user.Password.trim())
        .then((res) => {
          if (res.isSuccess) {
            let userInfo: IUsuario = {
              user: user.UserName,
              roles: res.rolesUser,
              info: res.infoAgente,
            };

            setErrorMessage("");

            if (userInfo.info.tienenumeradorrecibo === false) {
              setUser(userInfo);
              setToken(res.token);
              setVisibleModalRegistroCaiRecibo(true);
            } else {
              AsyncStorage.setItem("token", res.token);
              dispatch(userInit(userInfo));
              return;
            }
          } else {
            setUser(null);
            setToken("");
            setErrorMessage(res.message);
          }
        })
        .catch((res) => {
          setUser(null);
          setToken("");
          if (res) {
            const { data, status } = res;
            const text = status === 400 ? data.message : "";
            setErrorMessage(text);
          } else {
            setVisibleModalErrorConexion(true);
          }
        }),
      "l-is"
    );
  };

  const passwordInput = useRef(null);

  return (
    <Background>
      <LoadingIndicator area="l-is"></LoadingIndicator>
      <Logo />
      <Text status="primary" style={styles.header}>
        Bienvenido
      </Text>

      <Formik
        initialValues={{ UserName: "", Password: "" }}
        onSubmit={(values: IUsuarioLogin, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          onSignInButtonPress(values).then(() => resetForm());
        }}
        validationSchema={loginSchema}
      >
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          handleSubmit,
        }) => (
          <>
            <Input
              placeholder="Usuario"
              icon={PersonIcon}
              value={values.UserName}
              autoCapitalize="none"
              onChangeText={handleChange("UserName")}
              onBlur={() => setFieldTouched("UserName")}
              blurOnSubmit={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInput.current.focus();
              }}
            />
            {touched.UserName && errors.UserName && (
              <Text
                style={{ textAlign: "left" }}
                status="danger"
                appearance="hint"
                category="p2"
              >
                {errors.UserName}
              </Text>
            )}

            <Input
              style={styles.passwordInput}
              placeholder="Contraseña"
              icon={passwordVisible ? EyeIcon : EyeOffIcon}
              value={values.Password}
              autoCapitalize="none"
              secureTextEntry={!passwordVisible}
              onChangeText={handleChange("Password")}
              onBlur={() => setFieldTouched("Password")}
              onIconPress={onPasswordIconPress}
              returnKeyType="done"
              ref={passwordInput}
            />
            {touched.Password && errors.Password && (
              <Text status="danger" appearance="hint" category="p2">
                {errors.Password}
              </Text>
            )}

            {!!errorMessage && (
              <Text status="danger" style={styles.errorMessage}>
                {errorMessage}
              </Text>
            )}

            <Button
              style={styles.signInButton}
              size="medium"
              disabled={!isValid}
              onPress={() => handleSubmit()}
            >
              Iniciar Sesión
            </Button>
          </>
        )}
      </Formik>
      {visibleModalErrorConexion && ModalErrorConexion()}
      {visibleModalRegistroCaiRecibo && ModalRegistroCaiRecibos()}
    </Background>
  );
};

const styles = StyleSheet.create({
  signInButton: {
    margin: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  errorMessage: {
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    paddingVertical: 14,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  button: {
    //marginHorizontal: 5,
    width: "45%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

export default LoginScreen;
