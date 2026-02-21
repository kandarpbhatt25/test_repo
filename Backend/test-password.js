const bcrypt = require('bcrypt');

const hash = '$2b$10$z128gHFIpPLbhM78OPe0Peq067FOSQJUb9Z3Z8vkxR2y9H03yhk9W';

bcrypt.compare('admin123', hash).then(result => {
    console.log('Password "admin123" matches:', result);
});

bcrypt.compare('password', hash).then(result => {
    console.log('Password "password" matches:', result);
});

bcrypt.compare('123456', hash).then(result => {
    console.log('Password "123456" matches:', result);
});
