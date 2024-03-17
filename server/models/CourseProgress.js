const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
  courseId: {
    type: mongoose.Object.Types.ObjectId,
    ref: "Course",
  },
  courseVideos: [
    {
      type: mongoose.Object.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("CourseProgress", courseProgress);
