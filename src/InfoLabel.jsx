import './InfoLabel.css';

export default function InfoLabel({ href }) {
  if (!href.startsWith('https://')) {
    href = "https://platform.openai.com/docs/api-reference/chat/create#chat/create-" + href;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" className="info" />;
}
