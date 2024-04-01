import { Group } from '~/share/domain/entities'

export enum Path {
	Game = 'game',
	Help = 'help',
	Home = 'home',
	NotFound = 'not-found',
}

export const IDLE_PATH = Path.Home

export const SIMPLE_PATHS = new Group([Path.Home, Path.NotFound] as const)

export const PATHS = Group.fromValues(Path)

export const COMPOUND_PATHS = PATHS.difference(SIMPLE_PATHS)

export enum HelpSubPath {
	Main = '',
}

export const HELP_SUBPATHS = Group.fromValues(HelpSubPath)
