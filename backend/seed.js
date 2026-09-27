// Database seeder
require('dotenv').config();
const connectDB = require('./config/db');
const Music = require('./models/Music');
const User = require('./models/User');

const musicData = [
  // For minimal / good mood
  { title: "Weightless", artist: "Marconi Union", genre: "ambient", mood: ["calming", "relaxing"], suitableFor: ["minimal", "low_stress"], duration: "8:10", youtubeId: "UfcAVejslrU", description: "Scientifically designed to reduce anxiety" },
  { title: "Clair de Lune", artist: "Claude Debussy", genre: "classical", mood: ["relaxing", "focusing"], suitableFor: ["minimal", "low_stress"], duration: "5:00", youtubeId: "CvFH_6DNRCY", description: "A timeless piece for serene moments" },
  { title: "La Mer", artist: "Debussy", genre: "classical", mood: ["calming", "healing"], suitableFor: ["minimal"], duration: "18:00", youtubeId: "Y1RkJDkRxUg", description: "Ocean-inspired classical masterpiece" },

  // For low stress
  { title: "Lofi Hip Hop Beats", artist: "ChilledCow", genre: "lofi", mood: ["relaxing", "focusing"], suitableFor: ["low_stress", "minimal"], duration: "3:30", youtubeId: "jfKfPfyJRdk", description: "Perfect study and focus beats" },
  { title: "Morning Coffee Jazz", artist: "Jazz Cafe", genre: "jazz", mood: ["uplifting", "energizing"], suitableFor: ["low_stress"], duration: "4:15", youtubeId: "Dx5qFachd3A", description: "Bright jazzy tunes to start your day" },
  { title: "Acoustic Sunrise", artist: "Nature Sounds", genre: "acoustic", mood: ["calming", "healing"], suitableFor: ["low_stress", "moderate_stress"], duration: "5:00", youtubeId: "2OEL4P1Rz04", description: "Gentle acoustic melodies with nature" },

  // For moderate stress
  { title: "Rain Sounds & Piano", artist: "Relaxing Sounds", genre: "ambient", mood: ["calming", "healing"], suitableFor: ["moderate_stress", "high_stress"], duration: "60:00", youtubeId: "lFcSrYw-ARY", description: "Therapeutic rain sounds with soft piano" },
  { title: "Tibetan Singing Bowls", artist: "Meditation Music", genre: "meditation", mood: ["healing", "calming"], suitableFor: ["moderate_stress", "high_stress", "severe"], duration: "30:00", youtubeId: "qk9rE-B2Yt0", description: "Ancient healing tones for deep relaxation" },
  { title: "Forest Meditation", artist: "Nature Healing", genre: "nature", mood: ["calming", "relaxing"], suitableFor: ["moderate_stress", "low_stress"], duration: "45:00", youtubeId: "6p_yaNFSYao", description: "Immersive forest soundscape for peace" },

  // For high stress
  { title: "432 Hz Healing Frequency", artist: "Healing Music", genre: "meditation", mood: ["healing", "calming"], suitableFor: ["high_stress", "severe"], duration: "60:00", youtubeId: "Ap4NP6HlFqg", description: "Deep healing frequency meditation" },
  { title: "Breath & Calm", artist: "Mindfulness Studio", genre: "ambient", mood: ["calming", "healing"], suitableFor: ["high_stress", "severe", "moderate_stress"], duration: "20:00", youtubeId: "O-6f5wQXSu8", description: "Guided breathing with ambient soundscape" },
  { title: "Ocean Waves Meditation", artist: "Sea of Calm", genre: "nature", mood: ["calming", "relaxing", "healing"], suitableFor: ["high_stress", "moderate_stress"], duration: "60:00", youtubeId: "WHPEKLQID4U", description: "Deep ocean wave therapy sounds" },

  // For severe
  { title: "Deep Delta Waves Sleep", artist: "Brain Wave Music", genre: "meditation", mood: ["calming", "healing"], suitableFor: ["severe", "high_stress"], duration: "60:00", youtubeId: "A2sS4bFxVFY", description: "Deep sleep and recovery meditation" },
  { title: "Gregorian Chant Healing", artist: "Sacred Music", genre: "meditation", mood: ["healing", "calming"], suitableFor: ["severe"], duration: "40:00", youtubeId: "J3jRMrZR3Fw", description: "Ancient chants for emotional healing" },
  { title: "Spa Relaxation Music", artist: "Zen Garden", genre: "ambient", mood: ["relaxing", "healing"], suitableFor: ["severe", "high_stress"], duration: "3:00:00", youtubeId: "lCOF9LN_Zxs", description: "Complete spa experience for deep healing" },
];

const adminUser = {
  name: "Admin",
  email: "admin@soulsync.com",
  password: "admin123",
  role: "admin",
};

const seedDB = async () => {
  await connectDB();

  await Music.deleteMany({});
  await Music.insertMany(musicData);
  console.log(`✅ Seeded ${musicData.length} music tracks`);

  const existingAdmin = await User.findOne({ email: adminUser.email });
  if (!existingAdmin) {
    await User.create(adminUser);
    console.log('✅ Admin user created: admin@soulsync.com / admin123');
  }

  console.log('🎉 Database seeding complete!');
  process.exit();
};

seedDB();
