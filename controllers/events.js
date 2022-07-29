const { response } = require("express");
const Event = require("../models/event");
const mongoose = require("mongoose");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  //correct response
  res.status(200).json({
    ok: true,
    events,
  });
};

const newEvent = async (req, res = response) => {
  const event = new Event(req.body);

  try {
    event.user = req.uid;
    const newEvent = await event.save();

    res.status(201).json({
      ok: true,
      event: newEvent,
    });
  } catch (error) {
    //error response
    res.status(500).json({
      ok: false,
      msg: "error",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "not found",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "not authorized",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      event: updatedEvent,
    });
  } catch (error) {
    //error response
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "not found",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "not authorized",
      });
    }

    //----------------
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    //error response
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error",
    });
  }
};

module.exports = {
  getEvents,
  newEvent,
  updateEvent,
  deleteEvent,
};
