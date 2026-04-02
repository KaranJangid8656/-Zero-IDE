import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { FileNode } from "../models/FileNode";

const router = Router();

// --- Auth ---
router.post("/auth/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, passwordHash });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.json({ token, username });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// --- Projects ---
router.post("/projects", async (req, res) => {
    try {
        const { name, ownerId } = req.body;
        const project = new Project({ name, ownerId });
        await project.save();

        // Create root folder files or just leave empty
        res.status(201).json(project);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Not found" });
        res.json(project);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// --- Files ---
router.get("/projects/:id/files", async (req, res) => {
    try {
        const files = await FileNode.find({ projectId: req.params.id });
        res.json(files);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/projects/:id/files", async (req, res) => {
    try {
        const { name, parentId, isFolder, content } = req.body;
        const file = new FileNode({
            name,
            projectId: req.params.id,
            parentId: parentId || null,
            isFolder: !!isFolder,
            content: content || ""
        });
        await file.save();
        res.status(201).json(file);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/files/:id", async (req, res) => {
    try {
        const file = await FileNode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(file);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/files/:id", async (req, res) => {
    try {
        await FileNode.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
