import AddBtn from 'src/components/add-btn/add-btn'
import './main.component.scss'


export default function Main(): JSX.Element {
  return <main style={{ display: `flex` }}>
    <div className="container"
      style={{ position: `relative` }}>
      <div className="add-task-btn">
        <AddBtn></AddBtn>
      </div>
    </div>
  </main>
}
