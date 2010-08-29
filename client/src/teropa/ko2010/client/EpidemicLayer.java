package teropa.ko2010.client;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import teropa.globetrotter.client.Grid.Tile;
import teropa.globetrotter.client.osm.OpenStreetMapLayer;
import teropa.mxhr.client.ContentReceivedEvent;
import teropa.mxhr.client.ContentReceivedHandler;
import teropa.mxhr.client.MXHR;

import com.google.gwt.dom.client.ImageElement;
import com.google.gwt.widgetideas.graphics.client.ImageLoader;
import com.google.gwt.widgetideas.graphics.client.ImageLoader.CallBack;

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
			images.clear();
			onTilesActivated(tiles);
		}
	}
	
	@Override
	protected String getUrl(int zoom, int x, int y) {
		return baseUrl + timeStep + "/" + zoom + "/" + x + "/" + y + ".png";
	}
	
	@Override
	public void onTilesActivated(Collection<Tile> newTiles) {
		if (newTiles.isEmpty()) return;
		
		tiles.addAll(newTiles);
		
		MXHR mxhr = new MXHR();
		
		
		StringBuilder qryString = new StringBuilder();
		for (final Tile each : newTiles) {
			qryString.append("t=");
			qryString.append(timeStep);
			qryString.append(",");
			qryString.append(getZoomLevel());
			qryString.append(",");
			qryString.append(each.getCol());
			qryString.append(",");
			qryString.append(each.getRow());
			qryString.append("&");
		}
		
		final OpenStreetMapLayer _this = this;
		final List<Tile> remainingTiles = new ArrayList<Tile>(newTiles);
		mxhr.addContentReceivedHandler(new ContentReceivedHandler() {
			public void onContentReceived(final ContentReceivedEvent evt) {
				final Tile tile = remainingTiles.remove(0);
				ImageLoader.loadImages(new String[] { "data:image/png;base64,"+evt.payload },  new CallBack() {
					public void onImagesLoaded(ImageElement[] imageElements) {
						ImageElement imgEl = imageElements[0];
						images.put(tile, imgEl);
						context.getView().getCanvas().drawImage(imgEl, tile.getLeftX(), tile.getTopY(), tile.getWidth(), tile.getHeight());
						context.getView().tileUpdated(tile, _this);
					}
				});
			}
		});
		
		mxhr.load(baseUrl + "many?"+qryString.toString());
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
