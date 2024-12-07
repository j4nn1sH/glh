import Image from 'next/image';

export default function Empty(text: string) {
  return (
    <div className="flex flex-col h-full text-center justify-center items-center text-gray-400 text-sm">
      <Image
        src="/empty.png"
        alt="Emoji just seeing steam"
        width={100}
        height={100}
      />
      <p className="mt-3">Looks pretty empty here</p>
      <p className="italic">{text}</p>
    </div>
  );
}
