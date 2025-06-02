import Image from "next/image";

export default function Reference() {
  return (
    <div className="container mx-auto text-center">
      <p className="mb-4 text-lg text-gray-700">Other DTI Apps</p>
      <div className="flex items-center justify-center gap-8">
        <a
          href="https://www.rawmats.store/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 transition duration-200 hover:opacity-80"
        >
          <div className="flex h-16 w-16 items-center justify-center">
            <Image
              src="/RawmatsLogo.png"
              alt="RawMats Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-gray-600">RawMats</span>
        </a>
        <a
          href="https://dti6-industry-map.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 transition duration-200 hover:opacity-80"
        >
          <div className="flex h-16 w-16 items-center justify-center">
            <Image
              src="/CMJSLogo.png"
              alt="CMJS Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            Industry Map
          </span>
        </a>
      </div>
    </div>
  );
}
