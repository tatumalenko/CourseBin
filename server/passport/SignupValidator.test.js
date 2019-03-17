const test = require('ava');
const { SignupValidator } = require('./SignupValidator');

test('Username too short', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'a',
    password: 'b',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Username must be 6 characters or more.');
});

test('Username too long', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef' +
      'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    password: 'abcdefghi',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Username must be 100 characters or less.');
});

test('Username contains spaces', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'poop fighters',
    password: 'b',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Username cannot contain spaces.');
});

test('Password too short', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'b',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password must be 8 characters or more.');
});

test('Password too long', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef' +
      'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password must be 100 characters or less.');
});

test('Same username and password', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdefghi',
    password: 'abcdefghi',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Username and password cannot be the same.');
});

test('Password has no uppercase letters', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'abcdefghi',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password must contain uppercase letters.');
});

test('Password has no digit', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'Abcdefghi',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password must contain at least 1 digit.');
});

test('Password too simple 1', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'H@sh@b!e',
    password: 'Passw0rd',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password is too simple.');
});

test('Password too simple 2', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'H@sh@b!e',
    password: 'Password123',
  });
  t.log(credentialValidation);
  t.false(credentialValidation.valid);
  t.is(credentialValidation.message, 'Password is too simple.');
});

test('Valid credentials 1', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'Abcdefghi1',
  });
  t.log(credentialValidation);
  t.true(credentialValidation.valid);
  t.is(credentialValidation.message, '');
});

test('Valid credentials 2', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'abcdef',
    password: 'Abcdefghi1.~',
  });
  t.log(credentialValidation);
  t.true(credentialValidation.valid);
  t.is(credentialValidation.message, '');
});

test('Valid credentials 3', (t) => {
  const credentialValidation = SignupValidator.validate({
    username: 'H@sh@b!e',
    password: 'pASSword123!',
  });
  t.log(credentialValidation);
  t.true(credentialValidation.valid);
  t.is(credentialValidation.message, '');
});
