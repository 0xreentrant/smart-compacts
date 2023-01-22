type EditorProps = {
  doc: string,
  handleChange: Function
}

export const Editor = ({doc, handleChange}: EditorProps) => {
  return (
    <textarea name="text" className="my-3 block h-96 border w-full" value={doc} onChange={(e) => handleChange(e.target.value)}></textarea>
  )
}

