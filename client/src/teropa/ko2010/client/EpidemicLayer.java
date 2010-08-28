package teropa.ko2010.client;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import teropa.globetrotter.client.Grid.Tile;
import teropa.globetrotter.client.osm.OpenStreetMapLayer;

public class EpidemicLayer extends OpenStreetMapLayer {

	private int timeStep = 0;
	private Set<Tile> tiles = new HashSet<Tile>();
	
	public EpidemicLayer(String baseUrl, String name, boolean baseLayer) {
		super(baseUrl, name, baseLayer);
	}
	
	public int getTimeStep() {
		return timeStep;
	}
	
	public void setTimestep(int timeStep) {
		boolean chg = timeStep != this.timeStep;
		this.timeStep = timeStep;
		if (chg) {
			super.onAllTilesDeactivated();
			context.getView().draw(true);
			super.onTilesActivated(tiles);
		}
	}
	
	@Override
	protected String getUrl(int zoom, int x, int y) {
		return baseUrl + timeStep + "/" + zoom + "/" + x + "/" + y + ".png";
	}
	
	@Override
	public void onTilesActivated(Collection<Tile> newTiles) {
		super.onTilesActivated(newTiles);
		tiles.addAll(newTiles);
	}
	
	@Override
	public void onTilesDeactivated(Collection<Tile> removedTiles) {
		super.onTilesDeactivated(removedTiles);
		tiles.removeAll(removedTiles);
	}

	@Override
	public void onAllTilesDeactivated() {
		super.onAllTilesDeactivated();
		tiles.clear();
	}	
	
}
