module.exports = {
    'aws': {
        'key': 'AKIAT4OWSHKLYQ5QZH7P',
        'secret': 'xxxxx',
        'ses': {
            'from': {
                // replace with actual email address
                'default': '"Example.com" <noreply@example.com>', 
            },
            // e.g. us-west-2
            'region': 'us-east-1' 
        }
    },
    'facebookAuth': {
        'clientID': '5431900333602813', // your App ID
        'clientSecret': 'xxxxx', // your App Secret
        'callbackURL': 'https://www.eventbinge.com/auth/facebook/callback'
        //'clientID': '2348889588591567', // your TEST App ID
        //'clientSecret': 'xxxxxx', // your test App Secret
        //'callbackURL': "http://localhost:8081/auth/facebook/callback"

    }
};
