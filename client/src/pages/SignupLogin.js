import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Signup = () => {
  const userContext = useUserContext();
  const { isLoading, id, message } = userContext;
  const [formData, setFormData] = useState(initialState);
  const [registerPage, showRegisterPage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !!id) navigate('/');
    if (!!message) toast.error(message);
  }, [isLoading, id, navigate, message]);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();

    if (registerPage) {
      // @TODO: Form input validation after checking backend validation
      // if (formData.password.length <= 7)
      //   return toast.error('Password needs to have at least 7 characters.');
      // if (formData.password !== formData.confirmPassword)
      //   return toast.error('Password does not match!');

      userContext.signup(formData);
    } else userContext.login(formData);
  };

  const registerPageHandler = () => showRegisterPage((prevState) => !prevState);

  return (
    <section className="container center" id="cta">
      <form className="form" onSubmit={submitHandler}>
        <h2>{registerPage ? 'Register' : 'Login'}</h2>
        {registerPage && (
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Mong Kong"
              required
              onChange={inputHandler}
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="mongkong@gmail.com"
            required
            onChange={inputHandler}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={inputHandler}
          />
        </div>

        {registerPage && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              onChange={inputHandler}
            />
          </div>
        )}

        <button className="btn btn--form">{registerPage ? 'Register' : 'Login'}</button>

        <p>
          {registerPage ? 'Already a member?' : 'Not a member yet?'}
          <button
            className="btn btn--form btn--small"
            type="button"
            onClick={registerPageHandler}
          >{`${registerPage ? 'Go to Login' : 'Sign up now!'}`}</button>
        </p>
      </form>
    </section>
  );
};

export default Signup;
