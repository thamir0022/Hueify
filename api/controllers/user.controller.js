import ColorHistory from "../models/history.model.js";

export const getAllHistory = async (req, res) => {
  const { id: userId } = req.user;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const historyDoc = await ColorHistory.findOne({ userId });

    if (!historyDoc || historyDoc.history.length === 0) {
      return res
        .status(404)
        .json({ message: "No color history found for this user." });
    }

    res.status(200).json({ history: historyDoc.history });
  } catch (error) {
    console.error("Error fetching color history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching color history." });
  }
};

export const addColorHistory = async (req, res) => {
  const { hex } = req.body;
  const userId = req.user.id;

  // Validate the hex value format
  if (!hex || !/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
    return res.status(400).json({
      success: false,
      error: 'A valid hex value is required.',
    });
  }

  try {
    // Find the user's color history document
    let historyDoc = await ColorHistory.findOne({ userId });

    if (!historyDoc) {
      // Create a new history document if the user has no history
      historyDoc = new ColorHistory({
        userId,
        history: [hex],
      });
    } else {
      // Check if the color already exists
      if (!historyDoc.history.includes(hex)) {
        // Add the new color to the top of the array
        historyDoc.history.unshift(hex);

         // Limit the history array to 5 entries
        // if (historyDoc.history.length > 5) {
        //   historyDoc.history.pop();
        // }
      }
    }

    // Save the updated document
    await historyDoc.save();

    res.status(200).json({
      success: true,
      message: 'Color history updated successfully.',
      data: historyDoc.history,
    });
  } catch (error) {
    console.error('Error updating color history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update color history.',
    });
  }
};

