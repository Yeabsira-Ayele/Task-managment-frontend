interface HeadingProps{
    title:string;
    content:string
}

function Heading({ title, content}:HeadingProps) {
  return (
    <div className="flex flex-col items-start justify-start bg-transparent ">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-gray-300">{content}</p>
    </div>
  );
}

export default Heading;