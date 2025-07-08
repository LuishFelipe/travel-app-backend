import { Request, Response } from "express";
import { locationRepository } from "../repositories/location.repository";

export const locationController = {
  async create(req: Request, res: Response) {
    const { country, region, city, description } = req.body;
    const location = await locationRepository.createLocation({
      country,
      region,
      city,
      description,
    });
    return res.status(201).json(location);
  },

  async findAll(req: Request, res: Response) {
    const locations = await locationRepository.getLocations();
    return res.json(locations);
  },

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const location = await locationRepository.getLocationById(id);
    if (!location) return res.status(404).json({ error: "Localização não encontrada." });
    return res.json(location);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { country, region, city, description } = req.body;
    const location = await locationRepository.updateLocation(id, {
      country,
      region,
      city,
      description,
    });
    if (!location) return res.status(404).json({ error: "Localização não encontrada." });
    return res.json(location);
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;
    const location = await locationRepository.deleteLocation(id);
    if (!location) return res.status(404).json({ error: "Localização não encontrada." });
    return res.status(204).send();
  },
  
  async findByCity(req: Request, res: Response) {
    const { city } = req.params;
    const locations = await locationRepository.getLocationsByCity(city);
    if (locations.length === 0) return res.status(404).json({ error: "Nenhuma localização encontrada para esta cidade." });
    return res.json(locations);
  },

  async findByRegion(req: Request, res: Response) {
    const { region } = req.params;
    const locations = await locationRepository.getLocationsByRegion(region);
    if (locations.length === 0) return res.status(404).json({ error: "Nenhuma localização encontrada para esta regiao." });
    return res.json(locations);
  },

  async findByCountry(req: Request, res: Response) {
    const { country } = req.params;
    const locations = await locationRepository.getLocationsByCountry(country);
    if (locations.length === 0) return res.status(404).json({ error: "Nenhuma localização encontrada para este país." });
    return res.json(locations);
  },

  async findByDescription(req: Request, res: Response) {
    const { description } = req.params;
    const locations = await locationRepository.getLocationsByDescription(description);
    if (locations.length === 0) return res.status(404).json({ error: "Nenhuma localização encontrada para esta descricao." });
    return res.json(locations);
  }
}