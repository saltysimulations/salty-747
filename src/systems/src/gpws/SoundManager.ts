export interface Sound {
    name: string,
    duration: number,
}

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
            // sound playing logic goes here
        }
    }
}
