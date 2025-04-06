import { client } from "../prisma/prismaclient.js";
import axios from "axios";
// Create a new industry (without fuel consumption)
export const addIndustry = async (req, res) => {
  try {
    const { type, name, location, id } = req.body;

    if (!type || !name || !location || !id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userId = parseInt(id);
    const newIndustry = await client.industry.create({
      data: {
        type,
        name,
        location,
        userId,
      },
    });

    res.status(201).json({
      message: "Industry created successfully",
      industry: newIndustry,
    });
  } catch (error) {
    console.error("❌ Error creating industry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const predictEmissions = async (req, res) => {
  try {
    const { fuel_name, unit, amount, hours, energy_kwh, industryId } = req.body;

    // Fetch fuel info
    const fuel = await client.fuel.findFirst({
      where: { name: fuel_name, unit },
    });

    if (!fuel) {
      return res.status(404).json({ message: "Fuel not found in database" });
    }

    // Fetch industry info
    const industry = await client.industry.findUnique({
      where: { id: industryId },
    });

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    // Call Flask API
    const flaskResponse = await axios.post(
      "https://tart-vanessa-red-dot-b6eb5ef5.koyeb.app/",
      {
        fuel_type: fuel.name,
        fuel_qty: Number(amount),
        industry_type: industry.type,
        energy_kwh: Number(energy_kwh),
        hours: Number(hours),
      }
    );

    const { severity, suggestions, estimated_emissions_kg } =
      flaskResponse.data;

    // Store everything directly in FuelConsumption
    const fuelConsumption = await client.fuelConsumption.create({
      data: {
        industryId,
        fuelId: fuel.id,
        amount: Number(amount),
        hours: Number(hours),
        energyKwh: Number(energy_kwh),
        severity,
        suggestions: JSON.stringify(suggestions),
        emissionsKg: Number(estimated_emissions_kg),
      },
    });
    res.status(201).json({
      message: "Prediction stored successfully",
      severity,
      suggestions,
      emissions_kg: estimated_emissions_kg,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getIndustries = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const industries = await client.industry.findMany({
      where: { userId: parseInt(userId) },
      // No need to include consumptions
    });

    res.status(200).json(industries);
  } catch (error) {
    console.error("Error fetching industries:", error);
    res.status(500).json({ message: "Failed to fetch industries" });
  }
};

export const getIndustry = async (req, res) => {
  const { id } = req.params;

  try {
    const industry = await client.industry.findUnique({
      where: { id: parseInt(id) },
      include: {
        consumptions: {
          include: {
            fuel: true, // This will include all fuel details
          },
        },
      },
    });

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    res.status(200).json(industry);
  } catch (error) {
    console.error("Error fetching industry:", error);
    res.status(500).json({ message: "Failed to fetch industry" });
  }
};
