import SubscribeButton from "./button/SubscribeButton";

export default function Hero() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Simplify Your Crypto Strategy, Not Your Life
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Create multiple vaults, automate yield strategies, and manage risk
            effortlessly from a single wallet.
          </p>
          <SubscribeButton />
        </div>
      </section>
    </>
  );
}
