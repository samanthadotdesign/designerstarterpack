import jsSHA from 'jssha';

export default function initUserController(db) {
  // Add a new user that signs up
  const signup = async (req, res) => {
    const { name, email, password: userPassword } = req.body;

    try {
      // initialise the SHA object
      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });

      // input the password from the request to the SHA object
      shaObj.update(userPassword);

      // get the hashed password as output from the SHA object
      const hashedPassword = shaObj.getHash('HEX');

      // create new instance for the user
      await db.User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.redirect('/');
    } catch (error) {
      console.log('error signing up', error);
    }
  };

  // Sign user in
  const login = async (req, res) => {
    const { email, password: inputPassword } = req.body;
    try {
      // find the instance of the user
      const user = await db.User.findOne({
        where: { email },
      });

      // If user exists
      if (user) {
        const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
        shaObj.update(inputPassword);
        const hashedInputPassword = shaObj.getHash('HEX');
        const savedPassword = user.password;

        if (hashedInputPassword !== savedPassword) {
          console.log('We didn\'t recognize your password. Please try again!');
          res.sendStatus(403);
        }
        res.cookie('loggedIn', true);
        res.cookie('userId', user.id);
        res.redirect('/');
      } else {
        // If user doesn't exist
        console.log('We couldn\'t find your email. If you can\'t remember your account, we can send you a reminder.');
        res.sendStatus(403);
      }
    } catch (error) {
      console.log('error logging in', error);
    }
  };

  // User logs out
  const logout = async (req, res) => {
    try {
      // delete cookies
      res.clearCookie('loggedIn');
      res.clearCookie('userId');
      res.redirect('/');
    } catch (error) {
      console.log('error logging out', error);
    }
  };

  return { signup, login, logout };
}
