import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import stylesCustom from "../../styles/custom.module.css";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { getJSONCategory } from "../../utils/getLocalJSON";
import { getLocale } from "../../utils/getLocaleText";

export default function HomePlay(props) {
  const router = useRouter();

  const kategoriObj = props.kategori_data;
  const localeGeneral = props.localeData.general;

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h2>{localeGeneral.play_title}</h2>
        <h4>{localeGeneral.play_subtitle}</h4>
        <br></br>

        <div className={stylesCustom.grid}>
          {Object.keys(kategoriObj).map((key, id) => (
            <div
              key={id}
              onClick={() => router.push({ pathname: "/play/start", query: { category: key } })}
              className={stylesCustom.card_menu}
              style={{ marginRight: "15px", padding: "10px 10px 5px", height: '100%' }}
            >
              <Image src={`/assets/items/${key}/image/${kategoriObj[key].image_file[0]}`} width={400} height={400} alt="PlayButton"></Image> <h2 style={{textAlign: 'center'}}>{kategoriObj[key].show_name} &rarr;</h2>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {
//       localeData: {
//         general: localeDataGeneral,
//       },
//     },
//   };
// }

export const getStaticProps = async (context) => {
  var kategori_data = getJSONCategory();
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      kategori_data: kategori_data,
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
};
