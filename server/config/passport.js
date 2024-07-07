const passport = require("passport");
const { Strategy: GoogleStratgy } = require("passport-google-oauth20");
const { v4: uuid } = require("uuid");
const { default: slugify } = require("slugify");
const User = require("../models/user.model");
const UserCredentials = require("../models/userCredential.model");

passport.use(
  new GoogleStratgy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // 1- check if user already exists
      const userExist = await UserCredentials.findOne({
        providerId: profile.id,
      });

      if (userExist) {
        return done(null, { userId: userExist.user.toString() });
      } else {
        const user = await User.create({
          name: profile._json.name,
          email: profile._json.email,
          profileImage: profile._json.picture,
          slug: `${slugify(profile._json.name)}-${uuid()}`,
        });

        await UserCredentials.create({
          user: user._id,
          provider: "google",
          providerId: profile.id,
        });

        return done(null, { userId: user._id.toString() });
      }
    }
  )
);

module.exports = passport;
