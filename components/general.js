import Image from "next/legacy/image";

const FooterLogo = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "30vw" }}>
      <Image src="/assets/logolab2.png" alt="Vercel Logo" width={150} height={50} />
      <Image src="/assets/tf.png" alt="Vercel Logo" width={58} height={50} />
      <Image src="/assets/its.png" alt="Vercel Logo" width={82} height={50} />
      <Image src="/assets/logo-unair.png" alt="Vercel Logo" width={50} height={50} />
      <Image src="/assets/logo-resmi-soetomo-dari-dirut-235x300.png" alt="Vercel Logo" width={40} height={50} />
    </div>
  );
};

module.exports = {
  FooterLogo,
};
