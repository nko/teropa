package teropa.ko2010.client;

import com.allen_sauer.gwt.dnd.client.PickupDragController;
import com.allen_sauer.gwt.dnd.client.util.DOMUtil;
import com.allen_sauer.gwt.dnd.client.util.Location;
import com.allen_sauer.gwt.dnd.client.util.WidgetLocation;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.AbsolutePanel;

public class TimeControlDragController extends PickupDragController {

	private final TimeControl ctrl;
	
	private int lastLoc = Integer.MIN_VALUE;
	private Timer lingerTimer = new Timer() {
		public void run() {
			if (lastLoc > Integer.MIN_VALUE)
				ctrl.onKnobLingered(lastLoc);
		}
	};
	
	public TimeControlDragController(AbsolutePanel track, TimeControl ctrl) {
		super(track, true);
		this.ctrl = ctrl;
	}
	
	@Override
	public void dragMove() {
		super.dragMove();
		lingerTimer.cancel();
		lastLoc = context.desiredDraggableX - getBoundaryOffsetX();
		lastLoc = Math.max(0, lastLoc);
		lastLoc = Math.min(context.boundaryPanel.getOffsetWidth() - context.draggable.getOffsetWidth(), lastLoc);
		ctrl.onKnobMoved(lastLoc);
		lingerTimer.schedule(500);
	}
	
	@Override
	public void dragEnd() {
		super.dragEnd();
		lingerTimer.cancel();
	}

	private int getBoundaryOffsetX() {
		Location loc = new WidgetLocation(context.boundaryPanel, null);
		int left = loc.getLeft() + DOMUtil.getBorderLeft(context.boundaryPanel.getElement());
		return left;
	}
	
}
