
import  jwt  from 'jsonwebtoken';
import crypto from 'crypto';

const payload = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
}
const secretKey = crypto.randomBytes(64).toString('hex');
console.log('secretKey:', secretKey);
const token =  jwt.sign(payload, secretKey, { expiresIn: '1h' });
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error(err);
    } else {
    console.log(decoded);
  }
});


console.log(token);
