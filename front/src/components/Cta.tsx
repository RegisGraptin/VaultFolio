import SubscribeButton from "./button/SubscribeButton";

export default function Cta() {
  return (
    <>
      <section
        id="cta"
        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            DeFi shouldn’t feel like a part-time job. Simplify it!
          </h2>
          <p className="text-lg mb-8">
            Take back your time—let VaultFolio handle the complexity of your
            crypto strategy.
          </p>
          <SubscribeButton />
        </div>
      </section>
    </>
  );
}
