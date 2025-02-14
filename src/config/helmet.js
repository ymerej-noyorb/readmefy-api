const helmetOptions = {
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
};

export default helmetOptions;