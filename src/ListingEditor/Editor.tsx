type EditorProps = {
  doc: string,
  handleChange: Function
}

export const Editor = ({doc, handleChange}: EditorProps) => {
  const onChange = (e: { target: HTMLTextAreaElement }) => handleChange(e.target.value)
  return (
    <textarea name="text" className="my-3 block h-96 border w-full" value={doc} onChange={onChange}></textarea>
  )
}

