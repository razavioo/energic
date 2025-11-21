class Simulator {
    constructor(config = {}) {
        this.capacity = config.capacity || 10000; // Liters
        this.level = config.level || 0; // Current volume
        this.fillRate = config.fillRate || 50; // Liters per tick
        this.emptyRate = config.emptyRate || 30; // Liters per tick
        this.noise = config.noise || 0.5; // Random noise amplitude

        this.isFilling = false;
        this.isEmptying = false;
        this.hardness = 50; // Material property
    }

    tick() {
        let change = 0;
        if (this.isFilling) change += this.fillRate;
        if (this.isEmptying) change -= this.emptyRate;

        // Add noise
        if (change !== 0 || this.level > 0) {
            change += (Math.random() - 0.5) * this.noise;
        }

        this.level += change;
        this.level = Math.max(0, Math.min(this.capacity, this.level));

        return this.getState();
    }

    startFill() { this.isFilling = true; }
    stopFill() { this.isFilling = false; }
    startEmpty() { this.isEmptying = true; }
    stopEmpty() { this.isEmptying = false; }

    setLevel(percentage) {
        this.level = (percentage / 100) * this.capacity;
    }

    getState() {
        return {
            level: this.level,
            percentage: (this.level / this.capacity) * 100,
            capacity: this.capacity,
            isFilling: this.isFilling,
            isEmptying: this.isEmptying,
            hardness: this.hardness,
            timestamp: Date.now()
        };
    }
}

module.exports = Simulator;
