export interface Sound {
    name: string;
    duration: number;
}

// these sounds are placeholders until we get proper sounds
export const sounds = {
    terrainTerrain: {
        name: "aural_dont_sink",
        duration: 1,
    },
    cautionTerrain: {
        name: "aural_landing_gear",
        duration: 1,
    },
    pullUp: {
        name: "aural_pull_up",
        duration: 1,
    },
};

/**
 * A class for playing GPWS sounds
 */
export class SoundManager {
    private currentlyPlayingSound = false;

    /**
     * The duration of the current playing sound, in seconds
     */
    private currentSoundDuration = -1;
    private currentSoundDurationElapsed = -1;

    public update(deltaTime: number) {
        if (this.currentlyPlayingSound) {
            this.currentSoundDurationElapsed += deltaTime / 1000;
            if (this.currentSoundDurationElapsed >= this.currentSoundDuration) {
                this.currentlyPlayingSound = false;
                this.currentSoundDurationElapsed = -1;
                console.log("no longer playing sound");
            }
        }
    }

    /**
     * Plays a sound if a sound isn't already playing
     * @param sound The sound to play
     */
    public tryPlaySound(sound: Sound) {
        if (!this.currentlyPlayingSound) {
            this.currentlyPlayingSound = true;
            this.currentSoundDuration = sound.duration;
            console.log(`playing sound ${sound.name}`);
            Coherent.call("PLAY_INSTRUMENT_SOUND", sound.name);
        }
    }
}
