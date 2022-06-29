import classes from './Card.module.css';

const Card = ({ children, type }) => {
  /*
  Card type : Page            : Component
  List      : UserManagement : UserFields
  */

  return <div className={`${classes.card} ${classes[`${type}`]}`}>{children}</div>;
};

export default Card;
