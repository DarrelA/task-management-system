import classes from './Card.module.css';

const Card = ({ children, options = ['card'] }) => {
  /*
  Card type : Page            : Component
  List      : UserManagement : UserFields
  */

  const classesOptions = options.map((option) => `${classes[`${option}`]}`);

  return <div className={[...classesOptions].join(' ')}>{children}</div>;
};

export default Card;
