const express = require("express");
const router = express.Router();

const eventController = require("../controller/event");

router.post("/add-event", eventController.addEvent);
router.get("/get-event", eventController.getEvents);
router.get("/outdoor", eventController.getOutdoorEvents);
router.get("/indoor", eventController.getIndoorEvents);
router.put("/student-register/:id", eventController.registerStudent);
router.patch("/edit-event/:id", eventController.editEvent);
router.delete("/delete-event/:id", eventController.deleteEvent);

module.exports = router;
