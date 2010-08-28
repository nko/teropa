package teropa.ko2010.client;

import teropa.globetrotter.client.Map;
import teropa.globetrotter.client.common.Position;
import teropa.globetrotter.client.controls.CopyrightText;
import teropa.globetrotter.client.controls.Panner;
import teropa.globetrotter.client.controls.Zoomer;
import teropa.globetrotter.client.osm.OpenStreetMapLayer;
import teropa.globetrotter.client.proj.GoogleMercator;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DeferredCommand;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.RootLayoutPanel;

public class Client implements EntryPoint {

	public final Resources resources = GWT.create(Resources.class);
	
	public void onModuleLoad() {
		resources.style().ensureInjected();
		
		final Map map = new Map("100%", "100%");
		map.setResolutions(OpenStreetMapLayer.SUPPORTED_RESOLUTIONS);
		map.setMaxExtent(GoogleMercator.MAX_EXTENT);
		
		OpenStreetMapLayer base = new OpenStreetMapLayer("http://tile.openstreetmap.org/", "Mapnik", true);
		map.addLayer(base);
		
		map.addControl(new Panner(), Position.TOP_LEFT);
		map.addControl(new Zoomer(), Position.MIDDLE_LEFT);
		map.addControl(new CopyrightText(initCopyrightText()), Position.BOTTOM_LEFT);
		
		RootLayoutPanel.get().add(map);
		
		// TODO: Find out why we need to do this
		DeferredCommand.addCommand(new Command() {
			public void execute() {
				RootLayoutPanel.get().onResize();
			}
		});
	}

	private HTML initCopyrightText() {
		HTML res = new HTML("(c) <a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> (and) contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>");
		res.setStyleName("copy");
		return res;
	}
	
}
