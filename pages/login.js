import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../styles/Home.module.css";
import stylesCustom from "../styles/custom.module.css";
import { useRouter } from "next/router";
import { useAppContext } from "../context/state";
import React, { useState, useEffect, useRef } from "react";

import { Preferences } from "@capacitor/preferences";

import KioskBoard from "kioskboard";

import { getLocale } from "../utils/getLocaleText";
import { FooterLogo } from "../components/general";

import { LoginModalAnnouncement } from "../components/modal";

export default function Home({ localeData }) {
  const router = useRouter();
  const localeGeneral = localeData.general;
  const AudioSoundRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [marginDynamic, setMarginDynamic] = useState('0vh');
  const numpadRef = useRef(null);
  const inputUserUUID = useRef();

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }

    AudioSoundRef.current.play();
    AudioSoundRef.current.volume = 0.3;
    
    setInterval(() => {
      if (document.getElementById("KioskBoard-VirtualKeyboard")) {
        setMarginDynamic('30vh');
      } else {
        setMarginDynamic('0vh');
      }
    }, 700);
  }, []);

  useEffect(() => {
    if (numpadRef.current) {
      KioskBoard.run(numpadRef.current, {
        allowRealKeyboard: false,
        allowMobileKeyboard: false,
        autoScroll: false,
        keysEnterText: "Login",
        theme: "light",
        keysArrayOfObjects: [
          {
            0: "1",
            1: "2",
            2: "3",
          },
          {
            0: "4",
            1: "5",
            2: "6",
          },
          {
            0: "7",
            1: "8",
            2: "9",
          },
          {
            0: "0",
            1: ".",
          },
        ],
        keysEnterCallback: doLogin,
      });
    }
  }, [numpadRef]);

  function doLogin() {
    if (numpadRef.current.value.length > 10) {
      Preferences.set({
        key: "user_uuid",
        value: numpadRef.current.value,
      });

      initSettings()
        .then((result) => {
          router.push("/home");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function initSettings() {
    return new Promise((resolve, reject) => {
      Preferences.set({
        key: "mainmenu_music",
        value: "30",
      });

      Preferences.set({
        key: "enableRecog",
        value: "false",
      });

      Preferences.set({
        key: "buffered_sendedData",
        value: JSON.stringify({}),
      });

      Preferences.set({
        key: "isOnline",
        value: "false",
      });

      resolve("Ok");
    });
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "linear-gradient(rgba(36, 36, 36, 0.40), rgba(36, 36, 36, 0.40)), url('/bg2-uncom.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className="container">
          {/* <button type="button" className="btn btn-primary">Warning</button> */}
          <div className="d-flex align-items-center justify-content-center">
            <h1 className="display-2" style={{ color: "white", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000", textAlign: "center" }}>
              {localeGeneral.mainmenu_title}
            </h1>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <h4 className="display-8" style={{ color: "white", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000", textAlign: "center" }}>
              {localeGeneral.mainmenu_subtitle}
            </h4>
          </div>
          <br></br>
          <div className="row" style={{marginBottom: marginDynamic}}>
            <div className="col-10 col-sm-10 col-md-6 mb-4 h-10 mx-auto">
              <div className="card  text-center">
                <div className="card-header">Masukan Nomer HP</div>
                <div className="card-body">
                  <input className="inputFromKey" ref={numpadRef} type="text" data-kioskboard-type="numpad" placeholder="Masukan Nomer HP anda" />
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" onClick={() => doLogin()}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8 col-sm-8 col-md-6 mb-4 h-10 mx-auto">
              <FooterLogo></FooterLogo>
            </div>
          </div>
        </div>

        <LoginModalAnnouncement isShow={showModal} clickFunction={closeModal}></LoginModalAnnouncement>
      </main>
      <audio ref={AudioSoundRef} controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
    </div>
  );
}

export async function getStaticProps(context) {
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
}