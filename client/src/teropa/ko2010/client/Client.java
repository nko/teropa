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
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.user.client.Command;
import com.google.gwt.user.client.DeferredCommand;
import com.google.gwt.user.client.ui.DockLayoutPanel;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.LayoutPanel;
import com.google.gwt.user.client.ui.RootLayoutPanel;

public class Client implements EntryPoint {

	public final Resources resources = GWT.create(Resources.class);
	
	private final RootLayoutPanel root = RootLayoutPanel.get();
	
	public static final int NUM_STEPS = 40;
	
	public void onModuleLoad() {
		resources.style().ensureInjected();
		
		DockLayoutPanel dock = new DockLayoutPanel(Unit.PX);
		initLeft(dock);
		initMain(dock);
		root.add(dock);
		
		// TODO: Find out why we need to do this
		DeferredCommand.addCommand(new Command() {
			public void execute() {
				root.onResize();
			}
		});
	}

	private void initMain(DockLayoutPanel dock) {
		LayoutPanel mainPanel = new LayoutPanel();
		
		final Map map = new Map("100%", "100%");
		map.setMaxExtent(GoogleMercator.MAX_EXTENT);
		map.setResolutions(getResolutions(), 2);
		
		OpenStreetMapLayer base = new OpenStreetMapLayer(GWT.getHostPageBaseURL() + "tiles/osm", "Mapnik", true);
		map.addLayer(base);
		
		EpidemicLayer solanum = new EpidemicLayer(GWT.getHostPageBaseURL() + "tiles/solanum", "Solanum", false);
		map.addLayer(solanum);
		
		map.addControl(new Panner(), Position.TOP_LEFT);
		map.addControl(new Zoomer(), Position.MIDDLE_LEFT);
		map.addControl(new CopyrightText(initCopyrightText()), Position.BOTTOM_LEFT);
		
		mainPanel.add(map);
		
		TimeControl tc = new TimeControl(solanum);
		mainPanel.add(tc);
		mainPanel.setWidgetBottomHeight(tc, 30, Unit.PX, 50, Unit.PX);
		mainPanel.setWidgetLeftRight(tc, 50, Unit.PX, 50, Unit.PX);
		
		dock.add(mainPanel);
	}

	private void initLeft(DockLayoutPanel dock) {
		Label left = new Label("Left");
		left.setStyleName("LeftPanel");
		dock.addWest(left, 200);
	}

	private double[] getResolutions() {
		double[] resolutions = new double[7];
		for (int i=0, r=1 ; i < 7 ; i++, r++) {
			resolutions[i] = OpenStreetMapLayer.SUPPORTED_RESOLUTIONS[r];
		}
		return resolutions;
	}

	private HTML initCopyrightText() {
		HTML res = new HTML("(c) <a href=\"http://www.openstreetmap.org/\">OpenStreetMap</a> (and) contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>");
		res.setStyleName("copy");
		return res;
	}
	
}
