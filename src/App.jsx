function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ShotNotes</h1>
      <p>Speichere Fotos nicht nur, verstehe sie.</p>

      <form>
        <input placeholder="Link zur Referenz" /><br /><br />
        <select>
          <option>Licht</option>
          <option>Pose</option>
          <option>Farbe</option>
          <option>Komposition</option>
        </select><br /><br />
        <textarea placeholder="Warum ist dieses Foto gut?" /><br /><br />
        <button>Speichern</button>
      </form>
    </div>
  )
}

export default App