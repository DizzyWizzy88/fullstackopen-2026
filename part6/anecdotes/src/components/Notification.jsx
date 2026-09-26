import { useNotification } from "../store"

const Notification = () => {
  const notification = useNotification()

  if (!notification) return null

  const style = {
    border: "solid 1px",
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style} data-testid="notification">
      {notification}
    </div>
  )
}

export default Notification